import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as utils from 'os-utils'
import * as os from 'os'
import { CPU } from '../contract/types';

export const CpuRouter = express.Router();

CpuRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    (async () => {

        /*
            The load average is a UNIX-specific concept with no real equivalent on Windows, 
            Windows has something similar called CPU usgae where a load average of 1 roughly corresponds to a CPU utilization of 100%.
         */
        try 
        {
            utils.cpuUsage((v) => {
                let cpu: CPU = {
                    usage: v,
                    date: Date.now()
                }
                res.json(cpu) 
            })
        }
        catch(err) {
            res.status(400).send({
                message: err
            });
        }
    })()
});