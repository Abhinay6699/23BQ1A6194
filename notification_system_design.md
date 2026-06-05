# Stage 1

## Approach

The goal is to show the top 10 unread notifications by priority. Priority is determined by a weighted type order (placement > result > event), with recency as a tie-breaker within the same type. The script fetches notifications from the protected API, filters unread items, scores each item by type weight and timestamp, and then keeps only the top 10.

## Priority scoring

- Type weight (higher is better):
  - placement: 3
  - result: 2
  - event: 1
- Recency tie-breaker: newer timestamps rank higher among equal weights.

## Efficient maintenance for streaming updates

To maintain the top 10 as new notifications arrive, use a fixed-size min-heap keyed by (weight, timestamp). Each incoming notification is compared to the smallest item in the heap:

- If the heap has fewer than 10 items, push the new notification.
- If the heap is full and the new notification outranks the smallest item, replace it.

This approach keeps memory usage constant and runs in $O(n \log k)$, with $k=10$.

## How to run

1) Get a bearer token using the auth API and set it as an env var:

```
$env:EVAL_TOKEN="your_access_token_here"
```

2) Run the script:

```
node .\Stage1\priority_notifications.js
```

The script prints a table of the top 10 priority unread notifications.
