import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { setLastPath } from "@/redux/reducers/homereducer";

export const ViewAllButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setLastPath(location.pathname));
    navigate("/all-products");
  };

  return (
    <div className="flex justify-end">
      <Button
        variant="outline"
        onClick={handleClick}
        className="
    group relative overflow-hidden
    h-12 px-6
    text-base font-semibold
    flex items-center justify-center
    transition-all duration-500
    hover:bg-primary hover:text-primary-foreground
    hover:shadow-lg
  "
      >
        {/* Subtle animated background gradient */}
        <span
          className="
      absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent
      opacity-0 group-hover:opacity-100
      transition-opacity duration-500
    "
        />

        {/* Animated line */}
        <span
          className="
      absolute left-6 right-12 h-[2px] bg-current/40
      group-hover:right-6 transition-all duration-300 ease-out
    "
        />

        {/* Text + Arrow */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span
            className="
        transition-all duration-500 ease-out
        group-hover:mr-2
      "
          >
            View All
          </span>
          <ArrowRight
            className="
        h-5 w-5 transition-transform duration-300 ease-out 
        group-hover:translate-x-2
      "
          />
        </span>
      </Button>
    </div>
  );
};
