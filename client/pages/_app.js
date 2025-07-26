import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header  from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}></Header>
            <Component currentUser={currentUser} {...pageProps} />
        </div>

    )
}

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx); //For app component ,the argument is not context, but appContext which contains ctx
    const { data } = await client.get("/api/users/currentuser");

    let pageProps;
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser); // This will call the getInitialProps of the page component

    }
    return {
        pageProps,
        currentUser: data.currentUser // This will return { currentUser: ... } from the API response
    }; 
}

export default AppComponent;