import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success("New Booking Successfully created");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      //   reset();
    },
    onError: (error) => {
      toast.error("Failed to create booking");
      console.error(error);
    },
  });

  return { createBooking, isCreating };
}
