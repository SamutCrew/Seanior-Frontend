import { useEffect } from 'react';

const CarouselEvents = () => {
  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const carousel = document.querySelector('.event-carousel');
      if (carousel) {
        const firstItem = carousel.firstElementChild;
        if (firstItem) {
          carousel.appendChild(firstItem.cloneNode(true));
          firstItem.remove();
        }
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 text-center w-full max-w-4xl px-6">
      <button className="btn btn-primary mb-8">View Events</button>
      
      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        {/* Carousel Items */}
        <div className="event-carousel flex transition-transform duration-500 ease-in-out">
          {/* Event 1 */}
          <div className="carousel-item w-full flex-shrink-0 px-2">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img 
                  src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp" 
                  alt="Event 1" 
                  className="w-full h-64 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">Summer Swimming Competition</h3>
                <p>June 15, 2023 • 9:00 AM</p>
                <p>City Aquatic Center</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-primary">Register</button>
                </div>
              </div>
            </div>
          </div>

          {/* Event 2 */}
          <div className="carousel-item w-full flex-shrink-0 px-2">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img 
                  src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp" 
                  alt="Event 2" 
                  className="w-full h-64 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">Youth Swimming Clinic</h3>
                <p>June 22, 2023 • 2:00 PM</p>
                <p>Community Pool</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-primary">Register</button>
                </div>
              </div>
            </div>
          </div>

          {/* Event 3 */}
          <div className="carousel-item w-full flex-shrink-0 px-2">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img 
                  src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp" 
                  alt="Event 3" 
                  className="w-full h-64 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">Open Water Challenge</h3>
                <p>July 5, 2023 • 7:00 AM</p>
                <p>Lake Serenity</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-primary">Register</button>
                </div>
              </div>
            </div>
          </div>

          {/* Event 4 */}
          <div className="carousel-item w-full flex-shrink-0 px-2">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img 
                  src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp" 
                  alt="Event 4" 
                  className="w-full h-64 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">Family Swim Day</h3>
                <p>July 12, 2023 • 10:00 AM</p>
                <p>Sunshine Pool Complex</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-primary">Register</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <button className="btn btn-circle" onClick={() => {
            const carousel = document.querySelector('.event-carousel');
            if (carousel) {
              const lastItem = carousel.lastElementChild;
              if (lastItem) {
                carousel.insertBefore(lastItem.cloneNode(true), carousel.firstChild);
                lastItem.remove();
              }
            }
          }}>❮</button> 
          <button className="btn btn-circle" onClick={() => {
            const carousel = document.querySelector('.event-carousel');
            if (carousel) {
              const firstItem = carousel.firstElementChild;
              if (firstItem) {
                carousel.appendChild(firstItem.cloneNode(true));
                firstItem.remove();
              }
            }
          }}>❯</button>
        </div>
      </div>
    </div>
  );
};

export default CarouselEvents;