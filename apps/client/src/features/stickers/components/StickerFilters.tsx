import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search } from 'lucide-react';

interface StickerFiltersProps {
    q: string;
    setQ: (value: string) => void;
    minPrice: number;
    setMinPrice: (value: number) => void;
    maxPrice: number;
    setMaxPrice: (value: number) => void;
    selectedType: 'ALL' | 'DIGITAL' | 'PHYSICAL';
    setSelectedType: (value: 'ALL' | 'DIGITAL' | 'PHYSICAL') => void;
    sort: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
    setSort: (value: 'price_asc' | 'price_desc' | 'newest' | 'oldest') => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onReset?: () => void;
}

const StickerFilters = ({
    q,
    setQ,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    selectedType,
    setSelectedType,
    sort,
    setSort,
    onSubmit,
    onReset,
}: StickerFiltersProps) => {
    return (
        <aside className="w-full shrink-0 md:w-72">
            <Card className="border-border/50 bg-card/50 sticky top-20 space-y-6 p-6 shadow-sm backdrop-blur-sm">
                <div>
                    <h2 className="text-foreground/80 mb-4 text-lg font-semibold">Filters</h2>
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                                Search
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Search stickers..."
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="bg-background/50"
                                />
                                <Button type="submit" size="icon" variant="secondary">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                                    Price Range
                                </Label>
                                <span className="text-muted-foreground text-sm font-medium tabular-nums">
                                    ${minPrice} - ${maxPrice}
                                </span>
                            </div>
                            <Slider
                                max={50}
                                min={0}
                                step={0.1}
                                value={[minPrice, maxPrice]}
                                onValueChange={(value: number[]) => {
                                    setMinPrice(value[0]);
                                    setMaxPrice(value[1]);
                                }}
                                className="py-4"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                                Type
                            </Label>
                            <ToggleGroup
                                variant="outline"
                                type="single"
                                value={selectedType}
                                onValueChange={(value: 'ALL' | 'DIGITAL' | 'PHYSICAL') => {
                                    if (value) setSelectedType(value);
                                }}
                                className="flex-wrap justify-start gap-2"
                            >
                                {['ALL', 'DIGITAL', 'PHYSICAL'].map((type) => (
                                    <ToggleGroupItem
                                        key={type}
                                        value={type}
                                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted bg-background/50 capitalize"
                                    >
                                        {type.toLowerCase()}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                                Sort by
                            </Label>
                            <ToggleGroup
                                variant="outline"
                                type="single"
                                value={sort}
                                onValueChange={(
                                    value: 'price_asc' | 'price_desc' | 'newest' | 'oldest',
                                ) => {
                                    if (value) setSort(value);
                                }}
                                className="flex flex-col items-stretch gap-2"
                            >
                                <ToggleGroupItem
                                    value="newest"
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted bg-background/50 justify-start"
                                >
                                    Newest Arrivals
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="oldest"
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted bg-background/50 justify-start"
                                >
                                    Oldest First
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="price_asc"
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted bg-background/50 justify-start"
                                >
                                    Price: Low to High
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="price_desc"
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted bg-background/50 justify-start"
                                >
                                    Price: High to Low
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    onReset?.();
                                }}
                                className="w-1/2"
                                size="lg"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </aside>
    );
};

export default StickerFilters;
