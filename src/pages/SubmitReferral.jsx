import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { DollarSign, Users, FileCheck, Lightbulb } from "lucide-react";
const guidelines = [
  "Ensure all contact details are accurate before submission",
  "Include business type and years in operation",
  "Provide any relevant financial documentation",
  "Submit referrals before noon for same-day review",
  "Follow up with pending referrals within 48 hours",
];
export function SubmitReferral() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    loanAmount: "",
    fundingProgram: "",
    notes: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(
      "https://www.eazeconsulting.com/apply?cl=WDEO0&ag=VF03MNTKWH",
      "_blank",
    );
  };
  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
        Submit Referral
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card className="p-3 md:p-5 bg-card shadow-card border-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-secondary">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Pending Payout
              </p>
              <p className="text-lg md:text-xl font-bold text-foreground">
                $3,200
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-5 bg-card shadow-card border-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-secondary">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Funded Loans
              </p>
              <p className="text-lg md:text-xl font-bold text-foreground">16</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-5 bg-card shadow-card border-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-secondary">
              <FileCheck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Referrals Earned
              </p>
              <p className="text-lg md:text-xl font-bold text-foreground">
                $9,800
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Form */}
        <Card className="lg:col-span-2 p-4 md:p-6 bg-card shadow-card border-0">
          <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">
            Referral Information
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="businessName" className="text-xs md:text-sm">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="h-9 md:h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="contactName" className="text-xs md:text-sm">
                  Contact Name
                </Label>
                <Input
                  id="contactName"
                  placeholder="Enter contact name"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  className="h-9 md:h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="email" className="text-xs md:text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-9 md:h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="phone" className="text-xs md:text-sm">
                  Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-9 md:h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="loanAmount" className="text-xs md:text-sm">
                  Loan Amount
                </Label>
                <Input
                  id="loanAmount"
                  placeholder="$0.00"
                  value={formData.loanAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, loanAmount: e.target.value })
                  }
                  className="h-9 md:h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="fundingProgram" className="text-xs md:text-sm">
                  Funding Program
                </Label>
                <Select
                  value={formData.fundingProgram}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fundingProgram: value })
                  }
                >
                  <SelectTrigger className="bg-background h-9 md:h-10 text-sm">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="eazecap">EazeCap</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="notes" className="text-xs md:text-sm">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional information..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="text-sm"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-10 md:h-11 text-sm md:text-base"
            >
              Submit Referral
            </Button>
          </form>
        </Card>

        {/* Guidelines */}
        <Card className="p-4 md:p-6 bg-card shadow-card border-0 h-fit">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-warning" />
            <h3 className="font-semibold text-foreground text-sm md:text-base">
              Referral Guidelines
            </h3>
          </div>
          <ul className="space-y-2 md:space-y-3">
            {guidelines.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground"
              >
                <span className="text-primary mt-0.5">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
