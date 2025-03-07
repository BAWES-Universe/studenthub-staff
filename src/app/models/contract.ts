import { FixedPriceContract } from "./fixed-price-contract";
import { HourlyContract } from "./hourly-contract";
import { MonthlySalaryContract } from "./monthly-salary-contract";
import { Store } from "./store";
import { Candidate } from "./candidate";
import { Company } from "./company";

export class Contract {
    contract_uuid: string;
    company_id: number;
    parent_company_id: number;
    store_id: number;
    candidate_id: number;
    sar_id: number;

    type: string;
    detail: string;
    start_date: string;
    end_date: string;
    transfer_cost: number;
    currency_code: string;
    status: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    auto_generate: boolean;
    fixedPriceContract: FixedPriceContract;
    hourlyContract: HourlyContract;
    monthlySalaryContract: MonthlySalaryContract;
    amount: any;//FixedPriceContract | HourlyContract | MonthlySalaryContract
    store: Store;
    candidate: Candidate;
    company: Company;
    parentCompany: Company;
}