import axios from "axios";

const buildClient = ({ req }) => {
    if(typeof window === "undefined"){
        //we are on server
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", // This is the URL of the ingress controller in the Kubernetes cluster
            headers: req.headers // This is necessary to match the host header in the request, it
        })    //preconfigured axios instance
        // request should be made using "http://ingress-nginx-controller.ingress-nginx

    }else{
        //we are on the browser
        return axios.create({
            baseURL: "/",
            headers: req ? req.headers : {}
        });

    }
}

export default buildClient;