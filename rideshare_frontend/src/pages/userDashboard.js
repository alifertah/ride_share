import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography } from "@material-tailwind/react";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from '@/components/layout/sideBar';
import Primary from '@/components/buttons/primary';
import Link from 'next/link';


const tableHead = ["Departure", "Arrival", "Date", "action"];
const bookingTableHead = ["booking", "owner", "status", "action"];


const Modal = ({ tripId, setShowModal }) => {
  
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [id, setId] = useState(tripId);
  const formData = {
    departure, arrival, id
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://127.0.0.1:8000/updateTrip`, formData,{
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log("success")
        toast.success('User updated', {
          position: 'top-right',
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('Something wrong: ' + response.statusText, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "departure":
        setDeparture(value);
        break;
      case "arrival":
        setArrival(value);
        break;
      case "id":
        setId(value);
      default:
        break;
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <ToastContainer /> 
        
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                Trip ID: {tripId}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
              <input onChange={handleInputChange} type="text" name="id" value={id} hidden />
              <input onChange={handleInputChange} type="text" name="departure" value={departure} placeholder="Departure" className="p-3 border border-gray-300 rounded" />
              <input onChange={handleInputChange} type="text" name="arrival" value={arrival} placeholder="Arrival" className="p-3 border border-gray-300 rounded" />
              <button type='submit' >
                <Primary text="Submit"/>
              </button>
            </form>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

function UserDashboard() {
  const loggedUsername = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
};
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  useEffect(() => {
    const authToken = () => {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    };

    axios.defaults.headers.common['Authorization'] = authToken() ? `Bearer ${authToken()}` : '';
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/userDashboardData')
      .then((response) => {
        console.log(loggedUsername())
        let filtredTrips = response.data.data.trips.filter(val =>  val.owner === loggedUsername())
        // console.log(filtred)
        setTrips(filtredTrips);
        setBookings(response.data.data.bookings);
        console.log("BOOKINGS : ",bookings)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleModalOpen = (tripId) => {
    setShowModal(true);
    setSelectedTripId(tripId);
  };

  const handleAccept = (bookingId, tripId, userId) =>{
    axios.post('http://127.0.0.1:8000/acceptBooking', {"bookingId" : bookingId, "userId" :{userId}, "tripId" : tripId})
  }

  

  const handleShowUser = (userId) => {
    axios.get(`http://127.0.0.1:8000/user/${userId}`)
    .then((response) => {
      console.log(response)
    })
  }

  const handleDeleteTrip = (tripId) => {
    axios.delete(`http://127.0.0.1:8000/deleteTrip/${tripId}`)
    .then ((response) => {
      if (response) {
        toast.success('Trip deleted successfully!', {
          position: 'top-right',
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
    })
  } 
  return (
    <div className='flex'>

      <Sidebar items={[{name:"dashboard", link:"/userDashboard"}
      , {name:"new trip", link:"/newTrip"}]}/>
      <Card className="flex flex-col items-start h-full w-full overflow-scroll ">
      <div className='flex flex-col w-full'>
      <h1 className='text-3xl font-bold my-8'>TRIPS</h1>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 "
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 text-center"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => {
            const isLast = index === trips.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={index}>
                <td className={`text-center ${classes}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {trip.departure}
                  </Typography>
                </td>
                <td className={`text-center ${classes}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {trip.arrival}
                  </Typography>
                </td>
                <td className={`text-center ${classes}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {trip.date}
                  </Typography>
                </td>
                <td className={`flex space-x-4 w-full justify-center ${classes}`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium bg-[#346751] hover:bg-[#346711] cursor-pointer px-4 duration-200 text-center py-2 rounded-lg text-white"
                      onClick={() => handleModalOpen(trip.id, trip.user_id, trip.trip_id)}
                    >
                      Edit
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium px-4 bg-red-500 hover:bg-red-700 cursor-pointer duration-200 text-center py-2 rounded-lg text-white"
                      onClick={() => handleDeleteTrip(trip.id)}
                    >
                      Delete
                    </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ToastContainer /> 

      </div>


      {/* THIS IS BOOKINGS TABLE */}
      <div className='flex flex-col w-full'>
      <h1 className='text-3xl font-bold my-8'>Bookings</h1>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {bookingTableHead.map((head) => (
              
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((trip, index) => {
            const isLast = index === trips.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={index}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {trip.id}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {trip.trip_owner}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {trip.status}
                  </Typography>
                </td>
                <td className={classes}>
                  {
                    trip.status === "pending" ?
                     (
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium bg-[#346751] hover:bg-[#346711] cursor-pointer duration-200 text-center py-2 rounded-lg text-white"
                      onClick={() => handleAccept(trip.id)}
                    >
                      Accept
                    </Typography>

                     ) : (
                     <Link href={`/profiles/${trip.user_id}`}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium bg-blue-500 text-center py-2 rounded-lg text-white cursor-pointer"
                        onClick={() => handleShowUser(trip.user_id)}
                      >
                        Show user
                      </Typography>
                     </Link>
                    )
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      
      {showModal && (
        <Modal tripId={selectedTripId} setShowModal={setShowModal} />
      )}
    </Card>
    </div>
  );
}

export default UserDashboard;
