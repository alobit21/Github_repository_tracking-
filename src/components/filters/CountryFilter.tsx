import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search, Globe } from 'lucide-react';
import { getAllCountries } from '@/lib/countryDetection.js';

interface CountryFilterProps {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
  className?: string;
}

export function CountryFilter({ selectedCountries, onCountriesChange, className }: CountryFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const allCountries = useMemo(() => getAllCountries(), []);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return allCountries;
    
    const term = searchTerm.toLowerCase();
    return allCountries.filter(country => 
      country.country.toLowerCase().includes(term) ||
      country.countryCode.toLowerCase().includes(term)
    );
  }, [allCountries, searchTerm]);

  const handleCountryToggle = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      onCountriesChange(selectedCountries.filter(code => code !== countryCode));
    } else {
      onCountriesChange([...selectedCountries, countryCode]);
    }
  };

  const handleClearAll = () => {
    onCountriesChange([]);
  };

  const handleSelectGlobal = () => {
    onCountriesChange([]);
  };

  const getSelectedCountryNames = () => {
    return selectedCountries.map(code => {
      const country = allCountries.find(c => c.countryCode === code);
      return country ? country : { country: 'Unknown', countryCode: 'XX', flag: '🌍' };
    });
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-primary">Country Filter</h3>
          </div>
          {selectedCountries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Selected countries display */}
        {selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {getSelectedCountryNames().map((country) => (
              <Badge
                key={country.countryCode || 'unknown'}
                variant="secondary"
                className="flex items-center gap-1 text-xs"
              >
                <span>{country.flag}</span>
                <span>{country.country}</span>
                <X
                  className="h-3 w-3 cursor-pointer hover:text-primary"
                  onClick={() => handleCountryToggle(country.countryCode || 'XX')}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Global option */}
        <div className="flex items-center justify-between p-2 rounded-md border border-border/50 hover:bg-surface/50 transition-colors">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-primary">Global</span>
            <span className="text-xs text-muted-foreground">(All countries)</span>
          </div>
          <Button
            variant={selectedCountries.length === 0 ? "default" : "outline"}
            size="sm"
            onClick={handleSelectGlobal}
            className="text-xs"
          >
            {selectedCountries.length === 0 ? 'Active' : 'Select'}
          </Button>
        </div>

        {/* Search and select */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Country list */}
          <div className="max-h-48 overflow-y-auto space-y-1 border border-border/50 rounded-md p-2">
            {filteredCountries.slice(0, 20).map((country) => (
              <div
                key={country.countryCode}
                className="flex items-center justify-between p-2 rounded hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => handleCountryToggle(country.countryCode)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{country.flag}</span>
                  <div>
                    <div className="text-sm text-primary">{country.country}</div>
                    <div className="text-xs text-muted-foreground">{country.countryCode}</div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedCountries.includes(country.countryCode)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-border'
                  }`}
                >
                  {selectedCountries.includes(country.countryCode) && (
                    <div className="w-2 h-2 bg-white rounded-sm" />
                  )}
                </div>
              </div>
            ))}
            
            {filteredCountries.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No countries found
              </div>
            )}
          </div>
        </div>

        {/* Quick select common countries */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Quick Select</div>
          <div className="flex flex-wrap gap-1">
            {['US', 'GB', 'DE', 'FR', 'JP', 'CA', 'AU', 'IN', 'BR', 'SG'].map((code) => {
              const country = allCountries.find(c => c.countryCode === code);
              if (!country) return null;
              
              return (
                <Badge
                  key={code}
                  variant={selectedCountries.includes(code) ? "default" : "outline"}
                  className="flex items-center gap-1 text-xs cursor-pointer hover:bg-surface/50"
                  onClick={() => handleCountryToggle(code)}
                >
                  <span>{country.flag}</span>
                  <span>{country.countryCode}</span>
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Selection summary */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          {selectedCountries.length === 0 
            ? 'Showing repositories from all countries'
            : `Showing repositories from ${selectedCountries.length} ${selectedCountries.length === 1 ? 'country' : 'countries'}`
          }
        </div>
      </div>
    </Card>
  );
}
