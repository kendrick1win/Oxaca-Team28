export function Footer() {
  return (
    <footer className="w-full bg-transparent text-amber-900 border-t border-amber-200">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div>
            <h3 className="text-lg font-bold mb-2">Visit Us</h3>
            <p>123 Mexican Street</p>
            <p>Los Angeles, CA 90012</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-2">Contact</h3>
            <p>Phone: (555) 123-4567</p>
            <p>hola@mexicanrestaurant.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <div className="flex flex-col space-y-1">
              <a href="/menu">Menu</a>
              <a href="/about">About Us</a>
              <a href="/gallery">Gallery</a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4 ">
              <a href="#" className="hover:text-amber-600">
                Instagram
              </a>
              <a href="#" className="hover:text-amber-600">
                Facebook
              </a>
              <a href="#" className="hover:text-amber-600">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-200 mt-4 pt-4 text-center">
          <p>© 2025 Mexican Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
