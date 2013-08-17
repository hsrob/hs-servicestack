using System;
using System.Linq;
using System.Configuration;
using System.Collections.Generic;
using System.Web.Mvc;
using Funq;
using HsServiceStack.Biz.Dal;
using HsServiceStack.Models;
using HsServiceStack.WebServices;
using ServiceStack.Configuration;
using ServiceStack.CacheAccess;
using ServiceStack.CacheAccess.Providers;
using ServiceStack.Mvc;
using ServiceStack.OrmLite;
using ServiceStack.Redis;
using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;
using ServiceStack.ServiceInterface.ServiceModel;
using ServiceStack.WebHost.Endpoints;

[assembly: WebActivator.PreApplicationStartMethod(typeof(HsServiceStack.App_Start.AppHost), "Start")]
namespace HsServiceStack.App_Start
{
	public class AppHost
		: AppHostBase
	{		
		public AppHost() //Tell ServiceStack the name and where to find your web services
			: base("HS ServiceStack", typeof(TodoListService).Assembly) { }

		public override void Configure(Funq.Container container)
		{
            ServiceStack.Text.JsConfig<Guid>.SerializeFn = guid => guid.ToString();
            ServiceStack.Text.JsConfig<Guid?>.SerializeFn = guid => guid.ToString();
		
			//Configure User Defined REST Paths
            //Routes
            //  .Add<Hello>("/hello")
            //  .Add<Hello>("/hello/{Name*}");

			//Uncomment to change the default ServiceStack configuration
			//SetConfig(new EndpointHostConfig {
			//});

            //Caching
            container.Register<IRedisClientsManager>(c =>
                new PooledRedisClientManager("localhost:6379"));
            container.Register<ICacheClient>(c =>
                (ICacheClient)c.Resolve<IRedisClientsManager>()
                .GetCacheClient())
                .ReusedWithin(Funq.ReuseScope.None);

			//Enable Authentication
			ConfigureAuth(container);

			//Register all your dependencies
            container.RegisterAutoWiredAs<TodoBizRepo, ITodoBizRepo>().ReusedWithin(ReuseScope.Request);		

			//Set MVC to use the same Funq IOC as ServiceStack
			ControllerBuilder.Current.SetControllerFactory(new FunqControllerFactory(container));
		}

		//Uncomment to enable ServiceStack Authentication and CustomUserSession
		private void ConfigureAuth(Funq.Container container)
		{
			var appSettings = new AppSettings();

			//Default route: /auth/{provider}
			Plugins.Add(new AuthFeature(() => new TodoUserSession(), 
				new IAuthProvider[] {
					new CredentialsAuthProvider(appSettings), 
					new FacebookAuthProvider(appSettings), 
					new TwitterAuthProvider(appSettings), 
					new BasicAuthProvider(appSettings), 
				})); 

			//Default route: /register
			Plugins.Add(new RegistrationFeature()); 

			//Requires ConnectionString configured in Web.Config
			var connectionString = ConfigurationManager.ConnectionStrings["AppDb"].ConnectionString;
			container.Register<IDbConnectionFactory>(c =>
				new OrmLiteConnectionFactory(connectionString, SqliteDialect.Provider));

			container.Register<IUserAuthRepository>(c =>
				new OrmLiteAuthRepository(c.Resolve<IDbConnectionFactory>()));

			var authRepo = (OrmLiteAuthRepository)container.Resolve<IUserAuthRepository>();
			authRepo.CreateMissingTables();
		}

		public static void Start()
		{
			new AppHost().Init();
		}
	}
}