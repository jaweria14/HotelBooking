import React from "react";
import Title from "./Title.jsx";
import HotelCard from "./HotelCard.jsx";
import { useAppContext } from "../context/AppContext.jsx";


export default function FeaturedDestination() {
     const{navigate,rooms} =useAppContext();

    return rooms.length>0 &&(
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-16 lg:px-24 bg-slate-50 py-12 sm:py-16 md:py-20">

            {/* Title */}
            <Title
                title="Featured Destination"
                subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
            />

            {/* Hotel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-12 sm:mt-16 md:mt-20 w-full justify-items-center">
                {rooms.slice(0, 4).map((room, index) => {
                    return (
                        <HotelCard
                            key={room._id}
                            room={room}
                            index={index}
                        />
                    );
                })}
            </div>

            {/* Button */}
            <button
                onClick={() => {
                    navigate("/rooms");
                    scrollTo(0, 0);
                }}
                className="my-12 sm:my-16 px-4 sm:px-6 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
                View All Destinations
            </button>

        </div>
    );
}