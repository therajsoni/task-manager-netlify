"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    LineChart, Line,
    BarChart, Bar,
    AreaChart, Area,
    PieChart, Pie, Cell,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Jan", value: 40, value2: 24 },
    { name: "Feb", value: 30, value2: 13 },
    { name: "Mar", value: 20, value2: 98 },
    { name: "Apr", value: 27, value2: 39 },
    { name: "May", value: 18, value2: 48 },
    { name: "Jun", value: 23, value2: 38 },
    { name: "Jul", value: 34, value2: 43 },
];

const pieData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ViewGraphs({
    viewGraphs, setViewGraphs
}: {
    viewGraphs: any,
    setViewGraphs: any,
}) {
    return (
        <Dialog open={viewGraphs} onOpenChange={setViewGraphs}>
            <DialogContent className="overflow-y-scroll h-130 hide-scrollbar">
                <DialogTitle>Project View Base On Tasks Graphs</DialogTitle>

                <div className="grid  gap-6 p-6 ">

                    {/* Line Chart */}
                    <Card className="h-80">
                        <CardHeader>
                            <CardTitle>Line Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="value2" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    {/* Bar Chart */}
                    <Card className="h-80">
                        <CardHeader>
                            <CardTitle>Bar Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                    <Bar dataKey="value2" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Area Chart */}
                    <Card className="h-80">
                        <CardHeader>
                            <CardTitle>Area Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                                    <Area type="monotone" dataKey="value2" stroke="#82ca9d" fill="#82ca9d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="h-80">
                        <CardHeader>
                            <CardTitle>Pie Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Donut Chart */}
                    <Card className="h-80">
                        <CardHeader>
                            <CardTitle>Donut Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        fill="#82ca9d"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Radar Chart */}
                    <Card className="h-80">
                        <CardHeader>
                            <CardTitle>Radar Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={data}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="name" />
                                    <PolarRadiusAxis />
                                    <Radar name="Value" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    <Radar name="Value2" dataKey="value2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Scatter Chart */}
                    <Card className="h-80">
                        <CardHeader>
                            <CardTitle>Scatter Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="value" name="Value" />
                                    <YAxis type="number" dataKey="value2" name="Value2" />
                                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                    <Scatter name="Points" data={data} fill="#8884d8" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

            </DialogContent>
        </Dialog>
    );
}
