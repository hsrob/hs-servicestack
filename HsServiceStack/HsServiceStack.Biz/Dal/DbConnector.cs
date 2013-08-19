using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceStack.OrmLite;
using ServiceStack.WebHost.Endpoints;

namespace HsServiceStack.Biz.Dal
{
    public class DbConnector : IDisposable
    {
        private IDbConnection db;

        public virtual IDbConnection Db
        {
            get
            {
                return db ?? (db = EndpointHost.AppHost.TryResolve<IDbConnectionFactory>().Open());
            }
        }

        public void Dispose()
        {
            if(db != null)
                db.Dispose();
        }
    }
}
