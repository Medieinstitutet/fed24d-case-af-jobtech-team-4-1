import { useEffect, useState } from "react";
import type { IAd } from "../models/IAd";
import { getJobAds, OccupationId } from "../services/jobAdService";
import { Link } from "react-router";
import "./AdsPresentation.css";

type AdsPresentationProps = {
  occupation: OccupationId;
};

export const AdsPresentation = ({ occupation }: AdsPresentationProps) => {
  const [jobs, setJobs] = useState<IAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJobAds(occupation)
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch jobs");
        console.error(err);
        setLoading(false);
      });
  }, [occupation]);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  const formatDeadline = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ul>
      {jobs.map(job => (
        <li key={job.id}>
          <Link to={`/${job.id}`}>
            <h3>{job.headline}</h3>
          </Link>
          <p>
            {job.employer?.name} - {job.workplace_address.municipality}
          </p>
          <p>Sök senast: {formatDeadline(job.application_deadline)}</p>
        </li>
      ))}
    </ul>
  );
};
