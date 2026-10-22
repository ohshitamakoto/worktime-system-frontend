export const getKintaiData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch(() => alert("error"));
  });
};

export const getContentData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch(() => alert("error"));
  });
};

export const getTenkiData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch(() => alert("error"));
  });
};

export const subscribeToBackendUpdates = (onUpdate) => {
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  if (!backendURL || typeof EventSource === "undefined") {
    return () => {};
  }

  const eventSource = new EventSource(`${backendURL}events`);
  eventSource.addEventListener("refresh", onUpdate);
  return () => eventSource.close();
};

export const changeSect = (url) => {
  window.location.href = url;
};