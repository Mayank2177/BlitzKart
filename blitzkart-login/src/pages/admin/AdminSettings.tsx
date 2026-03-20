import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettings = () => (
  <div className="p-6 space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Configure store settings, notifications, payment methods, and admin preferences.</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminSettings;
