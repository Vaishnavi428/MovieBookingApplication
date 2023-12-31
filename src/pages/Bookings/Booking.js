import { useParams } from "react-router-dom";
import { getTheatresById } from "../../api/theatres.api";
import { useEffect, useState } from "react";
import { getMovieById } from "../../api/movie.api";
import Navbar from "../../components/Navbar/Navbar";
import { Button, Spinner } from "react-bootstrap";
import "./Booking.css";
import Cinema from "../../components/Cinema/Cinema";
import Payments from "../../components/Payments/Payments";
import { createBooking } from "../../api/bookings.api";


function Booking(){

    const {movieId, theatreId} = useParams();

    const [movieDetails, setMovieDetails] = useState(null);
    const [theatresDetail, setTheatersDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);


     const getTheareDetails = async () => {
        const theatresData= await  getTheatresById(theatreId);
        setTheatersDetails(theatresData.data);

    }

    const getMovieDetails = async ()=>{
        const movieDetails = await getMovieById(movieId);
        console.log(movieDetails);
        setMovieDetails(movieDetails.data);
    }

    const init= async ()=>{
          await Promise.all([getTheareDetails(), getMovieDetails()]);
          setIsLoading(false);
    }

    useEffect(()=>{
        init();
    },[])


    const proceedPayment =()=>{
      setShowPaymentModal(true);
    }

    const closeModel =()=>{
      setShowPaymentModal(false);
      setBookingDetails(null);
    }

    const confirmBooking = async ()=>{

      const data ={
        theatreId:theatreId,
        movieId:movieId,
        userId:localStorage.getItem('id'),
        noOfSeats:selectedSeats.length,
        totalCost:selectedSeats.length * movieDetails.price,
        timing:"EVENING"
      };

      const booking = await createBooking(data);

      //const payment = await makePayment();

      const paymentSuccess=true;

      if(paymentSuccess){
        booking.data.status = "SUCCESS";
      }else{
        booking.data.status = "FAILED";
      }

      setBookingDetails(booking.data);

    }



    


    return ( <div>

        <Navbar/>

        <div className="text-center bg-black fullView">

            {
                isLoading && <div >  <Spinner/>  </div>
            }

            {

                !isLoading &&
                
                <div className="">

                    <h2 className="fw-bold text-light"> {movieDetails.name} </h2>

                    <ShowCase/>

                    <Cinema movieDetails={movieDetails} selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />


                   <p className="info">
                    You have selected <span className="count">{selectedSeats.length}</span>{' '}
                    seats for the price of{' '}
                    <span className="total">
                    {selectedSeats.length * movieDetails.price} Rupees
                        </span>
                    </p>

                     <Button onClick={proceedPayment} variant="success" size="lg">
                        Proceed To Payment
                    </Button>


                </div>   


            }
       </div>

       {
        !isLoading && 
       <Payments show={showPaymentModal} closeModel={closeModel} setShow={setShowPaymentModal} theatresDetail={theatresDetail} movieDetails={movieDetails} selectedSeats={selectedSeats} confirmBooking={confirmBooking} bookingDetails={bookingDetails} />
        }

    </div>
    )

}













function ShowCase() {
  return (
    <ul className="ShowCase">
      <li>
        <span className="seat" /> <small>N/A</small>
      </li>
      <li>
        <span className="seat selected" /> <small>Selected</small>
      </li>
      <li>
        <span className="seat occupied" /> <small>Occupied</small>
      </li>
    </ul>
  )
}

export default Booking;