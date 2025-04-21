import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon, CheckCircle, ExternalLink, MapPin, Mail, Phone } from "lucide-react";
import { truncate } from "@/lib/utils";

export interface InstallerCardProps {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  verified: boolean;
  rating?: number;
  services: string[];
}

export function InstallerCard({
  id,
  name,
  description,
  email,
  phone,
  website,
  address,
  verified,
  rating = 0,
  services,
}: InstallerCardProps) {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 fill-accent text-accent" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-accent" />);
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-neutral-300" />
        );
      }
    }

    return stars;
  };

  return (
    <Card className="card h-full flex flex-col transition-all hover:shadow-card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {name}
              {verified && (
                <CheckCircle className="h-4 w-4 text-success" />
              )}
            </CardTitle>
            {rating > 0 && (
              <div className="flex items-center mt-1">
                <div className="flex mr-1">{renderStars()}</div>
                <span className="text-sm text-neutral-600">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        <CardDescription>{truncate(description, 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 mb-4">
          {address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-neutral-500 mt-1 mr-2" />
              <span className="text-sm">{address}</span>
            </div>
          )}
          <div className="flex items-start">
            <Mail className="h-4 w-4 text-neutral-500 mt-1 mr-2" />
            <span className="text-sm">{email}</span>
          </div>
          <div className="flex items-start">
            <Phone className="h-4 w-4 text-neutral-500 mt-1 mr-2" />
            <span className="text-sm">{phone}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Services Offered</h4>
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => (
              <Badge key={index} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm">
          Contact
        </Button>
        {website && (
          <Button
            variant="default"
            size="sm"
            className="gap-1"
            asChild
          >
            <a href={website} target="_blank" rel="noopener noreferrer">
              Visit Website
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
