import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { InstallerCard } from "@/components/installer-card";
import { MapPin, Search, Filter } from "lucide-react";
import { createApiUrl } from "@/lib/utils";

export default function Installers() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInstallers, setFilteredInstallers] = useState<any[]>([]);

  // Fetch counties
  const countiesQuery = useQuery({
    queryKey: [createApiUrl("/counties")],
  });

  // Fetch installers
  const installersQuery = useQuery({
    queryKey: [
      createApiUrl(
        selectedCounty ? `/installers?countyId=${selectedCounty}` : "/installers"
      ),
    ],
  });

  // Update filtered installers when installers data changes or filters change
  useEffect(() => {
    if (installersQuery.data && Array.isArray(installersQuery.data)) {
      let filtered = [...installersQuery.data];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (installer) =>
            installer.name.toLowerCase().includes(query) ||
            installer.description?.toLowerCase().includes(query) ||
            installer.address?.toLowerCase().includes(query)
        );
      }

      setFilteredInstallers(filtered);
    } else {
      setFilteredInstallers([]);
    }
  }, [installersQuery.data, searchQuery]);

  const handleCountyChange = (value: string) => {
    setSelectedCounty(value === "all" ? null : value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCounty(null);
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 mb-2">
          Find Solar Installers
        </h2>
        <p className="text-neutral-700">
          Connect with qualified solar installation companies in Kenya
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Installers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  id="search"
                  placeholder="Search by name or location"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Select value={selectedCounty || "all"} onValueChange={handleCountyChange}>
                  <SelectTrigger id="county" className="pl-8">
                    <SelectValue placeholder="Select a county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {Array.isArray(countiesQuery.data) && countiesQuery.data.map((county: any) => (
                      <SelectItem
                        key={county.id}
                        value={county.id.toString()}
                      >
                        {county.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {installersQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[320px]" />
          ))}
        </div>
      ) : filteredInstallers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstallers.map((installer) => (
            <InstallerCard
              key={installer.id}
              id={installer.id}
              name={installer.name}
              description={installer.description || ""}
              email={installer.email}
              phone={installer.phone}
              website={installer.website}
              address={installer.address}
              verified={installer.verified}
              rating={installer.rating}
              services={installer.services || []}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-neutral-600 mb-4">
              No installers found matching your search criteria.
            </p>
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
