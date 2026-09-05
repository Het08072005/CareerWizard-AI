import unittest
from datetime import datetime, timedelta, timezone

from app.models.job import Job, Skill
from app.services.job_service import compute_match_details, freshness_score, suitability_score


class JobRankingTests(unittest.TestCase):
    def test_fresh_jobs_outrank_old_jobs(self):
        now = datetime.now(timezone.utc)
        self.assertGreater(freshness_score(now), freshness_score(now - timedelta(days=40)))

    def test_fresher_roles_outrank_senior_roles(self):
        self.assertGreater(
            suitability_score("Graduate Python Engineer", "0-1 years experience"),
            suitability_score("Principal Python Architect", "8+ years experience"),
        )

    def test_match_explains_all_components(self):
        job = Job(title="Junior Python Developer", company="Example", description="Python SQL",
                  posted_at=datetime.now(timezone.utc), fetched_at=datetime.now(timezone.utc),
                  experience_level="Junior")
        job.required_skills = [Skill(name="Python"), Skill(name="SQL")]
        details = compute_match_details(job, ["Python", "PostgreSQL"], 80)
        self.assertEqual(set(details), {"total", "skills", "resume_quality", "freshness", "fresher_suitability"})
        self.assertGreaterEqual(details["total"], 60)


if __name__ == "__main__":
    unittest.main()
