using System.Web;
using System.Web.Optimization;
using BundleTransformer.Core.Builders;
using BundleTransformer.Core.Bundles;
using BundleTransformer.Core.Orderers;

namespace HsServiceStack
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            var nullBuilder = new NullBuilder();
            var nullOrderer = new NullOrderer();

            var styleBundle = new CustomStyleBundle("~/Assets/bundle/styles");
            styleBundle.Include("~/Assets/bootstrap/css/bootstrap.min.css",
                "~/Assets/bootstrap/css/bootstrap-glyphicons.css", 
                "~/Assets/css/shared_order/style.min.css");
            styleBundle.Builder = nullBuilder;
            styleBundle.Orderer = nullOrderer;
            bundles.Add(styleBundle);

            var styleComponentBundle = new CustomStyleBundle("~/Assets/bundle/styles/order");
            styleComponentBundle.Include("~/Assets/css/shared/*.css");
            styleComponentBundle.Builder = nullBuilder;
            styleComponentBundle.Orderer = nullOrderer;
            bundles.Add(styleComponentBundle);

            var scriptBundle = new CustomScriptBundle("~/Assets/bundle/scripts");
            scriptBundle.Include("~/Assets/bootstrap/js/bootstrap.min.js",
                "~/Assets/bootstrap/js/bootstrap.min.js",
                "~/Assets/js/shared_order/angular/angular.min.js",
                "~/Assets/js/shared_order/lodash.js",
                "~/Assets/js/shared_order/restangular.js");
            scriptBundle.Builder = nullBuilder;
            scriptBundle.Orderer = nullOrderer;
            bundles.Add(scriptBundle);

            var scriptComponentBundle = new CustomScriptBundle("~/Assets/bundle/scripts/order");
            scriptComponentBundle.Include("~/Assets/js/shared/*.js");
            scriptComponentBundle.Builder = nullBuilder;
            scriptComponentBundle.Orderer = nullOrderer;
            bundles.Add(scriptComponentBundle);
        }
    }
}