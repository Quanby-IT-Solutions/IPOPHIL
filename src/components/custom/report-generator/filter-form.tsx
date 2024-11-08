import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { classifications, origin_offices, types } from "@/lib/faker/documents/data"
import { FilterFormProps, FilterConfig } from "@/lib/types"
import { Icons } from "@/components/ui/icons"

const FILE_TYPES = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
] as const;

const FILTER_CONFIGS = {
    offices: {
        id: "origin_offices",
        label: "Offices",
        data: origin_offices
    },
    classification: {
        id: "classification",
        label: "Classification",
        data: classifications
    },
    type: {
        id: "type",
        label: "Type",
        data: types
    }
} as const;

const FilterForm: React.FC<FilterFormProps> = ({
    values,
    isDefaultDateRange,
    onSubmit,
    onClassificationChange,
    onTypeChange,
    onDateSelect,
    onOfficeChange,
    onFileTypeChange,
    onReset
}) => {
    const filters: FilterConfig[] = [
        {
            ...FILTER_CONFIGS.offices,
            options: FILTER_CONFIGS.offices.data,
            value: values.office,
            onChange: onOfficeChange
        },
        {
            ...FILTER_CONFIGS.classification,
            options: FILTER_CONFIGS.classification.data,
            value: values.classification,
            onChange: onClassificationChange
        },
        {
            ...FILTER_CONFIGS.type,
            options: FILTER_CONFIGS.type.data,
            value: values.type,
            onChange: onTypeChange
        }
    ];

    const hasActiveFilters =
        values.office !== "all" ||
        values.classification !== "all" ||
        values.type !== "all" ||
        !isDefaultDateRange;

    return (
        <form onSubmit={onSubmit}>
            <Card className="w-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Generate Reports</CardTitle>
                            <CardDescription>
                                Create a custom report by selecting filters and date range
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Filters</Label>
                            {hasActiveFilters && (
                                <Button
                                    variant={"ghost"}
                                    size="sm"
                                    onClick={onReset}
                                    className="h-8 px-2 lg:px-3 flex items-center text-muted-foreground hover:text-foreground"
                                >
                                    <Icons.rotateCcw className="mr-2 h-4 w-4" />
                                    Reset Filters
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {filters.map(({ id, label, options, value, onChange }) => (
                                <div className="grid gap-2" key={id}>
                                    <Label htmlFor={id}>{label}</Label>
                                    <Select value={value || "all"} onValueChange={onChange}>
                                        <SelectTrigger id={id}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {options.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    <div className="flex items-center">
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-2">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !values.date && "text-muted-foreground"
                                        )}
                                    >
                                        <Icons.calendarIcon className="mr-2 h-4 w-4" />
                                        {values.date?.from ? (
                                            values.date.to ? (
                                                <>
                                                    {format(values.date.from, "LLL dd, y")} -{" "}
                                                    {format(values.date.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(values.date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>All Dates</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={values.date?.from}
                                        selected={values.date}
                                        onSelect={onDateSelect}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Separator />

                        <div className="grid gap-2">
                            <Label>File Type</Label>
                            <Select value={values.fileType} onValueChange={onFileTypeChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {FILE_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            <div className="flex items-center">
                                                {type.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" variant={"default"} className="w-full">
                        Generate Report
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default FilterForm;