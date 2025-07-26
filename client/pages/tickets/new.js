import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';


const NewTicket = () => {

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [doRequest, errors] = useRequest({
      url: "/api/tickets",
      method: "post",
      body: {
        title,
        price
      },
      onSuccess: () => {
            Router.push('/');
        }
    });

    const onSubmit = (e) => {
      e.preventDefault();
      doRequest();
    }

    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)) {
            return;
        }
        return setPrice(value.toFixed(2));
    }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center fs-2">Create a New Ticket</h1>
      <form onSubmit={onSubmit} className="rounded border p-4 bg-light mx-auto" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter ticket title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="text"
            className="form-control"
            id="price"
            placeholder="Enter ticket price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Create Ticket
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
