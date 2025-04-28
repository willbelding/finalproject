// This file is needed to define a function that check reputation of any given
// SHA-256 hash against an external API (VirusTotal).
import axios from 'axios';

// Defines the key (constant) for API access of VirusTotal.
// This can be changed according to account key you have. 
const API_KEY = 'c508783960acd26cbffd1f4ad0e9fffaf1d89252aa089b9a4b077c627d7f3841';

// Declares the function to take the hash string and resolves to boolean
// to see if the hash was flagged as a danger by VirusTotal.
export async function checkVirusTotalHash(sha256: string): Promise<boolean> {
  try { // VirusTotal API querry for hash information
    // GET request to the API endpoint to carry out file lookups.
    const response = await axios.get(`https://www.virustotal.com/api/v3/files/${sha256}`, {
      headers: {
        'x-apikey': API_KEY
      }
    });

    // Retrieves information from API response, accesses malicious count.
    const data = response.data;
    const maliciousVotes = data.data.attributes.last_analysis_stats.malicious;

    // Outputs the lookup result. Notes the malicious votes number.
    console.log(`VirusTotal result for ${sha256}: ${maliciousVotes} malicious votes`);

    // If the amount of votes is more than 0, returns true. 
    return maliciousVotes > 0;
  } catch (error: any) { // Otherwise returns false
        if (error.response?.status === 429) {
        console.warn(`The VirusTotal quota has EXCEEDED for hash: ${sha256}`); // Quota limits for basic VirusTotal Accounts could cause an error in the function
        } else {
        console.warn('VirusTotal lookup FAILED for hash:', sha256, error.response?.data || error.message);
        }
        return false;
  }
}