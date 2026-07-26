import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useHotelAdmin(userId: string): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    setIsAdmin(false);

    const checkBadge = async () => {
      if (!supabase || !userId) return;
      const { data, error } = await supabase.rpc("is_hotel_admin");
      if (active && !error) setIsAdmin(data === true);
    };

    void checkBadge();
    return () => { active = false; };
  }, [userId]);

  return isAdmin;
}
