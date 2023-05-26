import { useQuery } from "react-query";
import axios from "axios";
import React from "react";

export const RQSuperheroes = () => {
  const [pollingStopped, stopPoll] = React.useState(false);

  const onSuccess = (data) => {
    if (data.length > 3) {
      stopPoll(true);
    }
    console.log("Success callback", data);
  };

  const onError = (err) => {
    if (isError) {
      stopPoll(true);
    }
    console.log("Error callback", err);
  };
  // first arg is a unique key
  // second arg is a function that returns a promise
  // third argument contains the options that we can pass, we can configure the cacheTime which by default is 5 mins.
  const { isLoading, data, isError, error, isFetching } = useQuery(
    "super-heroes",
    () => {
      return axios.get("http://localhost:4000/superheroes");
    },
    {
      // cacheTime: 5000,
      // staleTime: 30000,
      // refetchOnMount: true,
      // refetchOnWindowFocus: true,
      refetchInterval: pollingStopped ? 0 : 3000,
      // refetchIntervalInBackground: true,
      onSuccess,
      onError,
      select: (data) => {
        const superHeroesNames = data.data.map((hero) => hero.name);
        return superHeroesNames;
      },
    }
  );

  console.log(isLoading, isFetching, pollingStopped);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>Super Heroes Page</h2>
      {/* {data?.data.map((hero, index) => {
        return <div key={index}>{hero.name}</div>;
      })} */}
      {data.map((heroName) => (
        <div key={heroName}>{heroName}</div>
      ))}
    </>
  );
};

export default RQSuperheroes;

// every query is cached for 5 mins and react-query relies on that cache and returns the data from that cache
// react query in the background keeps fetching for the data, without setting isLoading to true, if the data is same as in the previous query it returns from the cache. The flag to check if react-query was fetching the data agin is isFetching
// on update of the data, loading does not happen, isFetching fetches the data and displays the correct data incase of updation
// we can give staleTime in options of useQuery which will allow not to do the API call again and use the stale query data, -> should be used for the pages where the data doesn't change very often and the user can see the stale data. There is no isFetching for the staleTime number of seconds. Default staleTime is 0s
// refetchOnMount -> the rq will refetch the data on mount if the data is stale.
// refetchOnWindowFocus -> the rq will keep fetching the updated data from remote server in the background and update the UI if there's any change in the data. Whereas in the traditional state management we explicitly have to refetch. By default this flag is set to true, we can have multiple values for this like 'always' or false. If false it will behave like traditional state management libraries, won't fetch the data if its updated on remote server
// refetchInterval -> the rq will automatically refetch every two seconds. -> use case -> real time data, stocks update, reduction in time duration -> Polling.
// refetchIntervalInBackground ->  true -> this will allow rq to keep refetching even when the browser is not in focus
// onSuccess, onError can be given to the options as callback that needs to be done on success and on error of api call
// select -> select method automatically recieves the data that we get from the API, therefore select can be used to transform the data according to our need.
