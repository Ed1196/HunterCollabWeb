export class GroupMessagingModel {
    public _id          ?: { $oid : string };
    public title        ?: string;
    public messages     ?: {
                            sender      : string;
                            message     : string;
                            time        : number;
                            displayName : string
                            }[];
    public date         ?: number;
    public duration     ?: number;
    
}

