﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by AsyncGenerator.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


using System;
using NUnit.Framework;

namespace NHibernate.Test.NHSpecificTest.NH3453
{
	using System.Threading.Tasks;
	[TestFixture]
	public class FixtureAsync : BugTestCase
	{
		public override string BugNumber
		{
            get { return "NH3453"; }
		}

        [Test]
        public async Task PropertyRefWithCompositeIdUpdateTestAsync()
        {
            using (var spy = new SqlLogSpy())
            using (var session = OpenSession())
            using (session.BeginTransaction())
            {

                var direction1 = new Direction { Id1 = 1, Id2 = 1, GUID = Guid.NewGuid() };
                await (session.SaveAsync(direction1));
                
                var direction2 = new Direction { Id1 = 2, Id2 = 2, GUID = Guid.NewGuid() };
                await (session.SaveAsync(direction2));
                
                await (session.FlushAsync());

                var directionReferrer = new DirectionReferrer
                                             {
                                                 GUID = Guid.NewGuid(),
                                                 Direction = direction1, 
                                             };

                await (session.SaveAsync(directionReferrer));

                directionReferrer.Direction = direction2;

                await (session.UpdateAsync(directionReferrer));

                await (session.FlushAsync());

                Console.WriteLine(spy.ToString());
                Assert.That(true);
            }
        }

    }
}