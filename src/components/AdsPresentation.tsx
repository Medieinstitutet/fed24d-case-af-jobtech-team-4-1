import { useEffect, useState } from "react"
import type { IAd } from "../models/IAd"
import { getJobAds, OccupationId } from "../services/jobAdService";
import { DigiLayoutBlock, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";

type AdsPresentationProps = {
    occupation: OccupationId;
}

export const AdsPresentation = ({occupation}: AdsPresentationProps) => {
    const [jobs, setJobs] = useState<IAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getJobAds(occupation)
        .then((data) => {
            setJobs(data);
            setLoading(false);
        })
        .catch((err) => {
            setError("Failed to fetch jobs");
            console.error(err);
            setLoading(false);
        });
    }, [jobs]);

    if (loading) return <p>Loading jobs...</p>
    if (error) return <p>{error}</p>

    return (
        <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}>
            <DigiTypography>
                <ul>
                    {jobs.map((job) => (
                        <li key={job.id}>
                            <strong>{job.headline}</strong> - {job.employer?.name}
                        </li>
                    ))}
                </ul>
            </DigiTypography>
        </DigiLayoutBlock>
    );
};