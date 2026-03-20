import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const AdminAnalytics = () => (
  <div className="p-6 space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Business Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Revenue trends, customer insights, product performance, and growth metrics.</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminAnalytics;
