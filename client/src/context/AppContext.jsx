import axios from "axios" ;
import {createContext, useContext, useEffect, useState } from "react";
import {useUser,useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

//set the base url 
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

const AppContext =createContext();

export const AppProvider =({children})=>{
   
    const currency =import.meta.env.VITE_CURRENCY || "$" ;
    const navigate =useNavigate();
    const {user} =useUser();
    const {getToken} =useAuth();
    const[isOwner ,setIsOwner] =useState(false);
    const [showHotelReg,setShowHotelReg] =useState(false);
    const[searchedCities,setSearchedCities] =useState([]);
    const [rooms, setRooms] = useState([])

const fetchRooms = async () => {
    try {
        const { data } = await axios.get('/api/rooms')

        console.log("API RESPONSE:", data)

        if (data.success) {
            console.log("ROOMS FROM API:", data.rooms)
            setRooms(data.rooms)
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.log("FETCH ROOMS ERROR:", error)
        toast.error(error.message)
    }
}

    const fetchUser=async()=>{
      try{
           const { data } = await axios.get('/api/user', {
    headers: {
        Authorization: `Bearer ${await getToken()}`
    }
});
     if(data.success){
      setIsOwner(data.role==="hotelOwner");
      setSearchedCities(data.recentSearchedCities);
     }
     else{
      //fect the user dat aafter the 5 secods
      setTimeout(()=>{
         fetchUser();
      },5000)
     }
      }
      catch(error){
         toast.error(error);
      }
  
    }

    useEffect(()=>{
      if(user){
      fetchUser();
      }
     
    },[user])

  useEffect(()=>{
     fetchRooms();
     console.log("Rooms:", rooms)
  },[])

 const value={
    currency,navigate,getToken,isOwner,setIsOwner,user,showHotelReg,setShowHotelReg,axios,searchedCities,setSearchedCities,rooms,setRooms
 }
   return(
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
   )
}

export const useAppContext =()=> useContext(AppContext)