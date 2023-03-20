import axios from 'axios'

const apiUrl = 'http://localhost:8000';

type SustainabilityScoreBody = {
  origin: string;
  time_of_search: string;
  destination: string;
};

type SustainabilityScoreResult = {
  sustainability_score: number;
  destination: string;
};

export async function sustainabilityScorePOST(data: SustainabilityScoreBody): Promise<SustainabilityScoreResult | undefined> {
  try {
    const req = await axios<SustainabilityScoreResult>(apiUrl + '/sustainability_score', {
      method: 'POST',
      data,
    });

    return req.data;
  } catch {
    return undefined;
  }
}
