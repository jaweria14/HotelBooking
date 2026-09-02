import React from 'react'
import { useState } from 'react'
import { assets, roomsDummyData } from '../../assets/assets'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
const ListRoom = () => {
    const [rooms, setRooms] = useState([])
    const{axios,getToken,user,currency} =useAppContext();

    //to ftech teh room
    // Fetch Rooms of the Hotel Owner
const fetchRooms = async () => {
    try {
        const { data } = await axios.get(
            '/api/rooms/owner',
            {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            }
        );

        if (data.success) {
            setRooms(data.rooms);
        }
        else{
            toast.error(data.message);
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
};
// Toggle Availability of the Room
const toggleAvailability = async (roomId) => {
    try{
        console.log('click')
      const { data } = await axios.post(
        '/api/rooms/toggle-availability',
        { roomId },
        {
            headers: {
                Authorization: `Bearer ${await getToken()}`
            }
        }
    );
 
    if (data.success) {
        toast.success(data.message);
        fetchRooms();
    } else {
        toast.error(data.message);
    }
    }
    catch(error){
            toast.error(error.message);
    }
   
};
useEffect(()=>{
    if(user){
    fetchRooms()
    }

},[user])
    return (
        <div>
            <Title
                align='left'
                font='outfit'
                title='Room Listings'
                subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.'
            />

            <p className='text-gray-500 mt-8'>All Rooms</p>

            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Price / night</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {
                          rooms.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {item.roomType}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {item.amenities.join(', ')}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                     {currency}{item.pricePerNight}
                                    </td>
                                    <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center'>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input type="checkbox" 
                                            onChange={()=>toggleAvailability(item._id)}className='sr-only peer' checked={item.isAvailable}  />
                                               
                                            {/* Toggle Background */}
                                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>

                                            {/* Toggle Knob / Circle */}
                                            <span className='absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 peer-checked:translate-x-5'></span>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListRoom