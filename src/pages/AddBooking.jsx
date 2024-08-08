import CreateBookingForm from "../features/bookings/CreateBookingForm";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

function AddBooking() {
  return (
    <Modal>
      <Modal.Open opens="booking-form">
        <Button>Create New Booking</Button>
      </Modal.Open>
      <Modal.Window name="booking-form">
        <CreateBookingForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddBooking;
