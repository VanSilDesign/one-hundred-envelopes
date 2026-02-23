export async function fetchAvailableNumbers() {
  const response = await fetch("/api/numbers/get-numbers?t=" + Date.now(), {
    credentials: "include",
  });

  const resData = await response.json();

  if (!response.ok) {
    console.log("Failed to fetch numbers, list is empty");
    return [];
  }

  return resData;
}

export async function saveSelectedNumber(number) {
  const response = await fetch("/api/numbers/save-number", {
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
  return resData;
}
