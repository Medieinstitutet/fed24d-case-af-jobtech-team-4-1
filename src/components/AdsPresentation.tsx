import { useContext, useEffect, useState } from "react";
import { getJobAds, OccupationId } from "../services/jobAdService";
import { Link, useParams, useNavigate } from "react-router";
import { JobContext } from "../contexts/JobContext";
import { JobActionTypes } from "../reducers/JobReducer";
import "./AdsPresentation.scss";
import { DigiLayoutContainer, DigiLinkButton, DigiLoaderSpinner } from "@digi/arbetsformedlingen-react";
import { LinkButtonSize, LinkButtonVariation, LoaderSpinnerSize } from "@digi/arbetsformedlingen";

type AdsPresentationProps = {
  occupation: OccupationId;
};

export const AdsPresentation = ({ occupation }: AdsPresentationProps) => {
  const { jobs, dispatch } = useContext(JobContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
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

  if (loading)
    return (
      <>
        <DigiLoaderSpinner afSize={LoaderSpinnerSize.MEDIUM} afText="Laddar"></DigiLoaderSpinner>
      </>
    );
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
      <DigiLayoutContainer>
        <DigiLinkButton
        className="back-btn"
          afSize={LinkButtonSize.MEDIUM}
          afVariation={LinkButtonVariation.SECONDARY}
          af-hide-icon={true}
          onClick={() => {
            navigate("/");
          }}
        >
          ⬅️ Tillbaka
        </DigiLinkButton>
      </DigiLayoutContainer>
      
      {jobs[occupation].length === 0 ? (
        <p>Inga jobbannonser hittades för {occupationSlug}.</p>
      ) : (
        <ul>
          {jobs[occupation].map(job => (
            <li key={job.id}>
              <Link to={`/${occupationSlug}/${job.id}`}>
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
