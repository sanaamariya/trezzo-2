import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useData } from "../lib/DataContext";
import { Restaurant } from "../lib/mockData";
import { AppBackground } from "./AppBackground";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  LogOut,
  Store,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Check,
  X,
  BarChart3,
  Clock,
  AlertCircle,
  MapPin,
  ChefHat,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { restaurants, reviews, updateRestaurantStatus } =
    useData();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [dialogAction, setDialogAction] = useState<
    "approve" | "reject" | null
  >(null);

  // Filter restaurants
  const pendingRestaurants = restaurants.filter(
    (r) => r.status === "pending",
  );
  const approvedRestaurants = restaurants.filter(
    (r) => r.status === "approved",
  );

  const handleApproveRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setDialogAction("approve");
  };

  const handleRejectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setDialogAction("reject");
  };

  const confirmAction = () => {
    if (selectedRestaurant && dialogAction) {
      const newStatus =
        dialogAction === "approve" ? "approved" : "rejected";
      updateRestaurantStatus(selectedRestaurant.id, newStatus);

      if (dialogAction === "approve") {
        toast.success(
          `${selectedRestaurant.name} has been approved! 🎉`,
        );
      } else {
        toast.error(
          `${selectedRestaurant.name} application has been rejected`,
        );
      }

      setSelectedRestaurant(null);
      setDialogAction(null);
    }
  };

  // Analytics
  const totalRestaurants = restaurants.length;
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "0";
  const positiveReviews = reviews.filter(
    (r) => r.sentiment === "positive",
  ).length;
  const positivePercentage =
    totalReviews > 0
      ? ((positiveReviews / totalReviews) * 100).toFixed(1)
      : "0";

  return (
    <AppBackground>
      {/* Header */}
      <div className="bg-white border-b border-orange-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Admin
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Approval{" "}
              {pendingRestaurants.length > 0 &&
                `(${pendingRestaurants.length})`}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pending Alert */}
            {pendingRestaurants.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900">
                        {pendingRestaurants.length} Restaurant
                        {pendingRestaurants.length > 1
                          ? "s"
                          : ""}{" "}
                        Awaiting Approval
                      </h4>
                      <p className="text-sm text-orange-700">
                        Review pending applications in the
                        approval queue
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("pending")}
                      className="border-orange-300 hover:bg-orange-100"
                    >
                      Review Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Store className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-semibold">
                    {approvedRestaurants.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Approved Restaurants
                  </p>
                </CardContent>
              </Card>
              <Card
                className={
                  pendingRestaurants.length > 0
                    ? "border-orange-200"
                    : ""
                }
              >
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-semibold">
                    {pendingRestaurants.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pending Approval
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-semibold">
                    {avgRating}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Avg Platform Rating
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-semibold">
                    {positivePercentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Positive Reviews
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* All Restaurants */}
            <Card>
              <CardHeader>
                <CardTitle>All Restaurants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {approvedRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="flex gap-4 p-3 border rounded-lg"
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">
                            {restaurant.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine.join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span>
                          {restaurant.reviewCount} reviews
                        </span>
                        <span>•</span>
                        <span className="text-green-600">
                          {restaurant.sentimentScore.positive}%
                          positive
                        </span>
                      </div>
                      {restaurant.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {restaurant.badges.map((badge) => (
                            <Badge
                              key={badge.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {badge.icon}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Restaurant Approval Queue
                </CardTitle>
                <CardDescription>
                  Review and approve new restaurant applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRestaurants.length > 0 ? (
                  pendingRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="p-4 border-2 border-orange-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-28 h-28 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            NEW
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold">
                                {restaurant.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <ChefHat className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {restaurant.cuisine.join(
                                    ", ",
                                  )}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-700"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {restaurant.status}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3 text-gray-700">
                            {restaurant.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span>{restaurant.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <DollarSign className="w-4 h-4 flex-shrink-0" />
                              <span>
                                Price Range:{" "}
                                {restaurant.priceRange}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {restaurant.cravings.map(
                                (craving) => (
                                  <Badge
                                    key={craving}
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {craving}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleApproveRestaurant(restaurant)
                          }
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve Restaurant
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() =>
                            handleRejectRestaurant(restaurant)
                          }
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg mb-2">
                      All Caught Up!
                    </h3>
                    <p>
                      No pending restaurant applications at the
                      moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Confirmation Dialog */}
          <AlertDialog
            open={dialogAction !== null}
            onOpenChange={() => setDialogAction(null)}
          >
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {dialogAction === "approve"
                    ? "Approve Restaurant?"
                    : "Reject Application?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogAction === "approve" ? (
                    <>
                      Are you sure you want to approve{" "}
                      <strong>
                        {selectedRestaurant?.name}
                      </strong>
                      ? This will make the restaurant visible to
                      all users on the platform.
                    </>
                  ) : (
                    <>
                      Are you sure you want to reject{" "}
                      <strong>
                        {selectedRestaurant?.name}
                      </strong>
                      ? The restaurant owner will be notified of
                      this decision.
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmAction}
                  className={
                    dialogAction === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  {dialogAction === "approve"
                    ? "Approve"
                    : "Reject"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  Overview of restaurant performance and user
                  engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-semibold text-blue-600">
                      {approvedRestaurants.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Active Restaurants
                    </p>
                  </div>
                  <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-semibold text-purple-600">
                      {totalReviews}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Reviews
                    </p>
                  </div>
                  <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-semibold text-yellow-600">
                      {avgRating}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avg Rating
                    </p>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="space-y-4 bg-white rounded-lg p-5 shadow-sm">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Platform Sentiment Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Positive Reviews</span>
                      </div>
                      <span className="font-semibold text-green-600 text-lg">
                        {positivePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                        style={{
                          width: `${positivePercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Negative Reviews</span>
                      </div>
                      <span className="font-semibold text-red-600 text-lg">
                        {(
                          100 - parseFloat(positivePercentage)
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-400 to-red-600 h-4 rounded-full transition-all duration-500"
                        style={{
                          width: `${100 - parseFloat(positivePercentage)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Restaurants */}
            <Card>
              <CardHeader>
                <CardTitle>Top Rated Restaurants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {approvedRestaurants
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((restaurant, index) => (
                    <div
                      key={restaurant.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-semibold text-white">
                        {index + 1}
                      </div>
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {restaurant.name}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {restaurant.rating}
                          </div>
                          <span>•</span>
                          <span>
                            {restaurant.reviewCount} reviews
                          </span>
                          <span>•</span>
                          <span className="text-green-600">
                            {restaurant.sentimentScore.positive}
                            % positive
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Restaurant Performance by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Cuisine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(
                    new Set(
                      approvedRestaurants.flatMap(
                        (r) => r.cuisine,
                      ),
                    ),
                  )
                    .slice(0, 5)
                    .map((cuisine) => {
                      const cuisineRestaurants =
                        approvedRestaurants.filter((r) =>
                          r.cuisine.includes(cuisine),
                        );
                      const avgCuisineRating = (
                        cuisineRestaurants.reduce(
                          (acc, r) => acc + r.rating,
                          0,
                        ) / cuisineRestaurants.length
                      ).toFixed(1);

                      return (
                        <div
                          key={cuisine}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">
                              {cuisine}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {cuisineRestaurants.length}{" "}
                              restaurants
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {avgCuisineRating}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppBackground>
  );
}