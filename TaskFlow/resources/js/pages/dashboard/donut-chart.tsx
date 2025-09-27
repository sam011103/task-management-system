import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"


interface ChartItem {
    status: string
    tasks: number
    fill: string
}

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  "not started": {
    label: "Not Started",
    color: "var(--chart-1)",
  },
  "in progress": {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  "in time": {
    label: "In Time",
    color: "var(--chart-3)",
  },
  "urgent": {
    label: "Urgent",
    color: "var(--chart-4)",
  },
  "overdue": {
    label: "Overdue",
    color: "var(--chart-5)",
  },
  "late": {
    label: "Late",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig

  export default function DonutChart({data}: {data: ChartItem[]}) {
    const totalTasks = React.useMemo(() => {
      return data.reduce((acc, curr) => acc + curr.tasks, 0)
    }, [])

    // const [innerRadius, setInnerRadius] = React.useState(80);

    //adjust donut inner radius through screen size
    // React.useEffect(() => {
    //   const handleResize = () => {
    //     setInnerRadius(window.innerWidth <1080 ? window.innerWidth < 640 ? 40 : 60 : 80);
    //   };
    //   window.addEventListener("resize", handleResize);
    //   handleResize();
    //   return () => window.removeEventListener("resize", handleResize);
    // }, []);

    return(
      
      <ChartContainer
          config={chartConfig}
          className="mx-auto"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="tasks"
              nameKey="status"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
    )
  }