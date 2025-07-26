import axios from "axios";
import Link from 'next/link';


const LandingPage = ({currentUser,tickets}) => {
  // console.log(currentUser,"currentUser in LandingPage");
  // axios.get("api/users/currentuser")
  console.log("Current User:", currentUser);
  return (
   <div className="container py-5">
      <h1 className="mb-4 text-center fs-2">Welcome to the Ticketing App</h1>
      <p className="text-center">Explore available tickets below.</p>
      <div className="row mt-4">
        <div className="col">
          <h3 className="text-center">Available Tickets</h3>
          <ul className="list-group">
            {tickets.map(ticket => (
              <li key={ticket.id} className="list-group-item">
                <h5>{ticket.title}</h5>
                <p>Price: ${ticket.price}</p>
                <Link href="/tickets/[ticketId]" as = {`/tickets/${ticket.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

LandingPage.getInitialProps = async (context,client,currentUser) => {
  const { data } = await client.get("/api/tickets");
  return {tickets: data}
}


export default LandingPage;