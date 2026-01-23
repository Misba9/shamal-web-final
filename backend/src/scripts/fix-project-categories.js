/**
 * Data Migration Script: Normalize Project Category Values
 * 
 * This script comprehensively cleans and normalizes project category data:
 * 1. Identifies all projects where category is a string (invalid)
 * 2. Validates ObjectId categories against actual Category documents
 * 3. Converts invalid categories to null
 * 4. Re-saves projects to ensure proper normalization
 * 5. Verifies final state
 * 
 * Usage:
 *   node src/scripts/fix-project-categories.js
 * 
 * Or import and run in your app initialization:
 *   import './scripts/fix-project-categories.js';
 */

import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Category from '../models/Category.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function fixProjectCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/shamal';
    
    if (!mongoUri) {
      throw new Error('DB_URL or MONGODB_URI must be set in .env');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Step 1: Get all valid category IDs
    const validCategoryIds = new Set();
    const categories = await Category.find({}).select('_id').lean();
    categories.forEach(cat => {
      validCategoryIds.add(String(cat._id));
    });
    console.log(`📋 Found ${validCategoryIds.size} valid categories in database`);

    // Step 2: Find all projects
    const projects = await Project.find({}).lean();
    console.log(`📊 Found ${projects.length} projects to check`);

    let fixedCount = 0;
    let validCount = 0;
    let invalidCategories = [];
    let orphanedCategories = [];

    // Step 3: Process each project
    for (const project of projects) {
      const category = project.category;
      let needsUpdate = false;
      let newCategoryValue = null;
      
      // Check category type and validity
      if (!category) {
        // null or undefined - valid, no action needed
        validCount++;
        continue;
      } else if (typeof category === 'string') {
        // Invalid: category is a string instead of ObjectId
        invalidCategories.push({
          projectId: project._id,
          projectTitle: project.title,
          invalidCategory: category,
          reason: 'String value instead of ObjectId'
        });
        newCategoryValue = null;
        needsUpdate = true;
      } else if (category instanceof mongoose.Types.ObjectId || mongoose.Types.ObjectId.isValid(category)) {
        // Valid ObjectId format - check if it references an existing category
        const categoryIdStr = String(category);
        if (validCategoryIds.has(categoryIdStr)) {
          // Valid ObjectId that references an existing category
          validCount++;
          // Ensure it's stored as ObjectId (re-save to normalize)
          newCategoryValue = new mongoose.Types.ObjectId(categoryIdStr);
          needsUpdate = true; // Re-save to ensure proper ObjectId format
        } else {
          // ObjectId format but references non-existent category
          orphanedCategories.push({
            projectId: project._id,
            projectTitle: project.title,
            invalidCategory: categoryIdStr,
            reason: 'ObjectId references non-existent category'
          });
          newCategoryValue = null;
          needsUpdate = true;
        }
      } else {
        // Other invalid format
        invalidCategories.push({
          projectId: project._id,
          projectTitle: project.title,
          invalidCategory: String(category),
          reason: 'Invalid format'
        });
        newCategoryValue = null;
        needsUpdate = true;
      }

      // Step 4: Update project if needed
      if (needsUpdate) {
        await Project.updateOne(
          { _id: project._id },
          { $set: { category: newCategoryValue } }
        );
        fixedCount++;
        
        if (newCategoryValue === null) {
          console.log(`🔧 Fixed project: "${project.title}" (ID: ${project._id}) - Set category to null`);
        } else {
          console.log(`✅ Normalized project: "${project.title}" (ID: ${project._id}) - Category: ${newCategoryValue}`);
        }
      }
    }

    // Step 5: Verify final state
    console.log('\n🔍 Verifying final state...');
    const finalProjects = await Project.find({}).lean();
    let finalStringCount = 0;
    let finalInvalidObjectIdCount = 0;
    let finalValidCount = 0;
    let finalNullCount = 0;

    for (const project of finalProjects) {
      const category = project.category;
      if (!category) {
        finalNullCount++;
      } else if (typeof category === 'string') {
        finalStringCount++;
        console.warn(`⚠️  WARNING: Project ${project._id} still has string category: ${category}`);
      } else if (mongoose.Types.ObjectId.isValid(category)) {
        const categoryIdStr = String(category);
        if (validCategoryIds.has(categoryIdStr)) {
          finalValidCount++;
        } else {
          finalInvalidObjectIdCount++;
          console.warn(`⚠️  WARNING: Project ${project._id} has ObjectId that doesn't reference valid category: ${categoryIdStr}`);
        }
      } else {
        finalInvalidObjectIdCount++;
        console.warn(`⚠️  WARNING: Project ${project._id} has invalid category format`);
      }
    }

    // Step 6: Summary
    console.log('\n📈 Migration Summary:');
    console.log(`   Total projects: ${projects.length}`);
    console.log(`   Projects fixed: ${fixedCount}`);
    console.log(`   Projects with valid categories: ${finalValidCount}`);
    console.log(`   Projects with null categories: ${finalNullCount}`);
    console.log(`   Projects with string categories (should be 0): ${finalStringCount}`);
    console.log(`   Projects with invalid ObjectIds (should be 0): ${finalInvalidObjectIdCount}`);

    if (invalidCategories.length > 0) {
      console.log('\n⚠️  Projects with invalid string categories (fixed):');
      invalidCategories.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.projectTitle}" (ID: ${item.projectId})`);
        console.log(`      Invalid value: "${item.invalidCategory}"`);
        console.log(`      Reason: ${item.reason}`);
      });
    }

    if (orphanedCategories.length > 0) {
      console.log('\n⚠️  Projects with orphaned ObjectId categories (fixed):');
      orphanedCategories.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.projectTitle}" (ID: ${item.projectId})`);
        console.log(`      Orphaned ObjectId: ${item.invalidCategory}`);
        console.log(`      Reason: ${item.reason}`);
      });
    }

    // Final verification
    if (finalStringCount === 0 && finalInvalidObjectIdCount === 0) {
      console.log('\n✅ Migration completed successfully!');
      console.log('✅ All project categories are now normalized (ObjectId or null)');
    } else {
      console.log('\n⚠️  Migration completed with warnings');
      console.log('⚠️  Some projects may still have invalid categories');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    console.error('Stack trace:', error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixProjectCategories();
}

export default fixProjectCategories;
