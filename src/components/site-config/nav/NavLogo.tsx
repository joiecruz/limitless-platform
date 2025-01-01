import { Link } from "react-router-dom";

export function NavLogo() {
  return (
    <div className="flex-shrink-0">
      <Link to="/">
        <img 
          src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
          alt="Limitless Lab"
          className="h-10 w-auto"
        />
      </Link>
    </div>
  );
}