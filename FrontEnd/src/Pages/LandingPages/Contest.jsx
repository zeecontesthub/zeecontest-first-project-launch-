import { Search } from "lucide-react";
import logo from "../../assets/Logo.png";
import ContestListing from "../../Components/LandingPageComp/contest/ContestListing";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const Contest = () => {
  const [contests, setContests] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Debounced search input
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Intersection Observer to trigger next page load
  const observer = useRef(null);
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch contests
  useEffect(() => {
    let cancelled = false;
    const fetchContests = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `/api/contest/get-contests/contests?page=${page}&limit=30&q=${encodeURIComponent(
            debouncedSearch
          )}`
        );

        if (cancelled) return;

        setContests((prev) =>
          page === 1 ? data.contests : [...prev, ...data.contests]
        );
        setHasMore(Boolean(data.hasMore));
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching contests", err);
        setError("Failed to load contests. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContests();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <nav className="bg-white px-4 md:px-12 lg:px-30 py-4">
        <div>
          <img
            src={logo}
            alt="ZeeContest"
            className="w-[120px] h-[52px] sm:w-[150px] sm:h-[66px] lg:w-[190px] lg:h-[83px]"
          />
        </div>
      </nav>

      <section className="w-full">
        <div className="bg-gradient-to-br from-[#034045] to-[#0a5a60] min-h-[400px] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
          <div className="max-w-4xl w-full text-center relative z-10">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Vote in Live Contests
            </h1>

            <p className="text-white/90 text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto px-4">
              Participate in contests across different institutions,
              organizations and events. Your voice matters.
            </p>

            <div className="w-full mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-50" />
                <input
                  type="text"
                  placeholder="Search Contests..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 bg-[#D9D9D9] backdrop-blur-sm rounded-xl border-0 shadow-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#034045]/30 focus:bg-white transition-all duration-300 text-base"
                />
              </div>

              <button className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#034045] text-white p-2 rounded-lg cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <ContestListing
          contests={contests}
          loading={loading}
          error={error}
          lastItemRef={lastItemRef} // Pass ref for infinite scroll
        />
      </section>
    </>
  );
};

export default Contest;
