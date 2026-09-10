"use client";

import { useEffect, useState } from "react";
import { getReviews, saveReview } from "@/services/commerce";
import { useAppContext } from "@/context/AppContext";

export default function Reviews({ productId }) {
  const { userData } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const load = () => getReviews(productId).then((response) => setReviews(response.data ?? [])).catch((requestError) => setError(requestError.message));
  useEffect(() => { load(); }, [productId]);

  const submit = async (event) => {
    event.preventDefault();
    try { await saveReview(productId, { rating, comment }); setComment(""); await load(); }
    catch (requestError) { setError(requestError.message); }
  };

  return <section className="w-full py-10"><h2 className="mb-4 text-2xl font-semibold">Customer reviews</h2>{error ? <p className="text-red-600">{error}</p> : null}{userData ? <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded border p-4"><select aria-label="Rating" value={rating} onChange={(event) => setRating(Number(event.target.value))} className="rounded border p-2">{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select><textarea aria-label="Review" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} className="rounded border p-2" placeholder="Share your experience" /><button className="self-start rounded bg-orange-600 px-4 py-2 text-white">Save review</button></form> : <p className="mb-4 text-gray-500">Log in to leave a review.</p>}<div className="space-y-3">{reviews.map((review) => <article key={review.id} className="rounded border p-4"><p className="font-medium">{review.user?.name} · {review.rating}/5</p><p className="text-gray-600">{review.comment || "No comment"}</p></article>)}</div></section>;
}
