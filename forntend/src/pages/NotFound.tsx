import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 md:px-6 text-center">
        {/* 404 Display */}
        <div className="relative mb-8">
          <span className="text-[150px] md:text-[200px] font-display font-bold text-primary/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Page Not Found
            </h1>
          </div>
        </div>

        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
