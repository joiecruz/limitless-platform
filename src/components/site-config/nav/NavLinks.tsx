import { Link } from "react-router-dom";

export function NavLinks() {
  return (
    <nav className="hidden md:flex space-x-8">
      <Link to="/product" className="text-gray-700 hover:text-[#393CA0]">Product</Link>
      <Link to="/services" className="text-gray-700 hover:text-[#393CA0]">Services</Link>
      <Link to="/courses" className="text-gray-700 hover:text-[#393CA0]">Courses</Link>
      <Link to="/tools" className="text-gray-700 hover:text-[#393CA0]">Tools</Link>
    </nav>
  );
}