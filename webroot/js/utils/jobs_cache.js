/*
Client-side Jobs Cache mechanism using JSON Object
*/
private var jobs_cache = {
    indeed_jobs : [];
    glassdoor_companies : [];
};

function add_indeed_cache(blob) {
    jobs_cache.indeed_jobs.push(blob);
}

function add_glassdoor_cache(blob) {
    jobs_cache.glassdoor_companies.push(blob);
}

function get_indeed_cache() {
    return jobs_cache.indeed_jobs;
}

function get_glassdoor_cache() {
    return jobs_cache.glassdoor_companies;
}
