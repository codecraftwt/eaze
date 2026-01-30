import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Users, DollarSign, TrendingUp, Mail } from "lucide-react";
export function Affiliate() {
  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-background">
      <div className="text-center max-w-2xl mx-auto px-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">
          Become an Affiliate
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground">
          Join our affiliate program and earn commissions for every successful
          referral
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-2 md:pb-4">
            <div className="mx-auto p-2 md:p-3 bg-primary-10 rounded-full w-fit">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <CardTitle className="text-base md:text-lg">
              Competitive Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-muted-foreground">
              1% of the loan value successfully funded
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2 md:pb-4">
            <div className="mx-auto p-2 md:p-3 bg-primary-10 rounded-full w-fit">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <CardTitle className="text-base md:text-lg">
              Real-time Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-muted-foreground">
              Monitor your referrals and earnings with our intuitive dashboard
            </p>
          </CardContent>
        </Card>

        <Card className="text-center sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2 md:pb-4">
            <div className="mx-auto p-2 md:p-3 bg-primary-10 rounded-full w-fit">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <CardTitle className="text-base md:text-lg">
              Dedicated Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-muted-foreground">
              Get personalized support from our affiliate management team
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Apply Now</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Fill out the form below to join our affiliate program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="firstName" className="text-sm">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className="h-9 md:h-10"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="lastName" className="text-sm">
                Last Name
              </Label>
              <Input id="lastName" placeholder="Doe" className="h-9 md:h-10" />
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="h-9 md:h-10"
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="company" className="text-sm">
              Company Name (Optional)
            </Label>
            <Input
              id="company"
              placeholder="Your Company"
              className="h-9 md:h-10"
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="phone" className="text-sm">
              Contact Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              className="h-9 md:h-10"
            />
          </div>

          <Button className="w-full gap-2 h-10 md:h-11 text-white">
            <Mail className="h-4 w-4" />
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
