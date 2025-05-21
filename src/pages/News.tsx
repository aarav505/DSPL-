
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const News = () => {
  const newsItems = [
    {
      title: "Interhouse Tournament Schedule Released",
      date: "2025-05-15",
      excerpt: "The schedule for the upcoming interhouse football tournament has been released. The tournament will begin next week with opening matches...",
      author: "Sports Committee"
    },
    {
      title: "Player Stats Update: Week 3",
      date: "2025-05-12",
      excerpt: "All player statistics have been updated following the third week of matches. Several standout performances have been noted...",
      author: "DSFL Admin Team"
    },
    {
      title: "New Transfer Rules Announced",
      date: "2025-05-08",
      excerpt: "The DSFL committee has announced changes to the transfer system. Players will now have additional transfer opportunities during tournament breaks...",
      author: "Games Committee"
    }
  ];

  return (
    <div className="min-h-screen bg-dsfl-dark">
      <Navbar />
      <div className="py-10">
        <div className="dsfl-container">
          <h1 className="text-3xl font-bold mb-6">Latest News</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <Card key={index} className="bg-dsfl-darkblue border-gray-700">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{item.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-gray-400">By {item.author}</span>
                  <button className="text-dsfl-primary hover:underline">Read more</button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
