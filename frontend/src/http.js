export async function fetchAvailableNumbers() {
  const response = await fetch("http://localhost:3000/numbers/get-numbers?t=" + Date.now(), {
    credentials: "include",
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch numbers");
  }
  // LOG DI CONTROLLO: Così vedi esattamente cosa arriva ogni volta
  console.log("Dati caricati dal DB:", resData);

  return resData;
}

export async function saveSelectedNumber(number) {
  const response = await fetch("http://localhost:3000/numbers/save-number", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number: number }),
    credentials: "include",
  });

  const resData = await response.json();

  if(!response.ok) {
    throw new Error(resData.message || "Failed to save number");
  }
  console.log("Dati salvati: " + resData);
  return resData;
}
