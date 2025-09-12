import { useContext, useEffect, useState } from "react";
import { getJobAds, OccupationId } from "../services/jobAdService";
import { Link, useParams } from "react-router";
import { JobContext } from "../contexts/JobContext";
import { JobActionTypes } from "../reducers/JobReducer";
import "./AdsPresentation.scss";

type AdsPresentationProps = {
  occupation: OccupationId;
};

export const AdsPresentation = ({ occupation }: AdsPresentationProps) => {
  const { jobs, dispatch } = useContext(JobContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { occupationSlug } = useParams<{ occupationSlug?: string }>();

  useEffect(() => {
    if (jobs[occupation].length > 0) {
      setLoading(false);
      return;
    }

    getJobAds(occupation)
      .then(data => {
        dispatch({
          type: JobActionTypes.SET_JOBS,
          payload: { occupation, jobs: data },
        });
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch jobs");
        console.error(err);
        setLoading(false);
      });
  }, [occupation, dispatch]);

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
  <>
    {jobs[occupation].length === 0 ? (
      <p>Inga jobbannonser hittades för {occupationSlug}.</p>
    ) : (
      <ul>
        {jobs[occupation].map(job => (
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
    )}
  </>
);
};
